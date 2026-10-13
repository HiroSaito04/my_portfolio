
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImagePlus,
  MessageSquare,
  Send,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

/* =========================================================
   CONFIGURATION
========================================================= */

const TABLE = "portfolio_comments";
const BUCKET = "comment-avatars";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const REFRESH_INTERVAL = 60_000;
const MAX_VISIBLE_COMMENTS = 50;

/* =========================================================
   UTILITIES
========================================================= */

function getAvatarUrl(path) {
  if (!supabase || !path) return null;

  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)
    .data.publicUrl;
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/* =========================================================
   COMMENT AVATAR
========================================================= */

function CommentAvatar({ name, path }) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  const avatarUrl = getAvatarUrl(path);

  return (
    <div
      className="comment-avatar"
      aria-hidden="true"
    >
      <span>{initials || "?"}</span>

      {avatarUrl && !imageFailed && (
        <img
          src={avatarUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}

/* =========================================================
   COMMENTS SECTION
========================================================= */

export function CommentsSection() {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
  });

  const fileInputRef = useRef(null);

  /* =======================================================
     LOAD COMMENTS FROM DATABASE
  ======================================================= */

  const loadComments = useCallback(
    async ({ quiet = false } = {}) => {
      if (!supabase) {
        setLoadError(
          "Comments are not configured yet."
        );
        setLoading(false);
        return false;
      }

      if (!quiet) {
        setLoading(true);
      }

      const { data, count, error } = await supabase
        .from(TABLE)
        .select(
          "id, name, body, avatar_path, created_at",
          { count: "exact" }
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(MAX_VISIBLE_COMMENTS);

      if (error) {
        console.error(
          "Failed to load comments:",
          error
        );

        setLoadError(
          "Unable to load comments right now."
        );

        setLoading(false);
        return false;
      }

      setComments(data ?? []);
      setTotal(count ?? data?.length ?? 0);

      setLoadError("");
      setLoading(false);

      return true;
    },
    []
  );

  /* =======================================================
     INITIAL LOAD + PERIODIC SYNC
  ======================================================= */

  useEffect(() => {
    loadComments();

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        loadComments({ quiet: true });
      }
    }, REFRESH_INTERVAL);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadComments({ quiet: true });
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadComments]);

  /* =======================================================
     PHOTO PREVIEW
  ======================================================= */

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(photo);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  /* =======================================================
     PHOTO SELECTION
  ======================================================= */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    setSubmitStatus({
      type: "",
      message: "",
    });

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!ALLOWED_TYPES[file.type]) {
      setPhoto(null);
      event.target.value = "";

      setSubmitStatus({
        type: "error",
        message:
          "Please choose a JPG, PNG, or WebP image.",
      });

      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setPhoto(null);
      event.target.value = "";

      setSubmitStatus({
        type: "error",
        message:
          "Profile photos must be 5 MB or smaller.",
      });

      return;
    }

    setPhoto(file);
  };

  const removePhoto = () => {
    setPhoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =======================================================
     SAVE COMMENT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!supabase) {
      setSubmitStatus({
        type: "error",
        message:
          "Comment storage is not configured.",
      });
      return;
    }

    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (
      cleanName.length < 2 ||
      cleanName.length > 80
    ) {
      setSubmitStatus({
        type: "error",
        message:
          "Name must be between 2 and 80 characters.",
      });
      return;
    }

    if (
      cleanComment.length < 1 ||
      cleanComment.length > 1200
    ) {
      setSubmitStatus({
        type: "error",
        message:
          "Comment must be between 1 and 1200 characters.",
      });
      return;
    }

    setSubmitting(true);

    setSubmitStatus({
      type: "",
      message: "",
    });

    try {
      let avatarPath = null;

      /* UPLOAD OPTIONAL PHOTO */

      if (photo) {
        const extension = ALLOWED_TYPES[photo.type];

        if (
          !extension ||
          photo.size > MAX_PHOTO_SIZE
        ) {
          throw new Error(
            "Invalid profile photo."
          );
        }

        avatarPath =
          `public/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from(BUCKET)
            .upload(avatarPath, photo, {
              contentType: photo.type,
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          throw uploadError;
        }
      }

      /* SAVE COMMENT PERMANENTLY */

      const { error: insertError } = await supabase
        .from(TABLE)
        .insert({
          name: cleanName,
          body: cleanComment,
          avatar_path: avatarPath,
        });

      if (insertError) {
        throw insertError;
      }

      /* RESET FORM ONLY AFTER SUCCESS */

      setName("");
      setComment("");
      removePhoto();

      setSubmitStatus({
        type: "success",
        message:
          "Your comment has been saved successfully.",
      });

      /* UPDATE COMMENT LIST + COUNT */

      await loadComments({ quiet: true });
    } catch (error) {
      console.error(
        "Failed to submit comment:",
        error
      );

      setSubmitStatus({
        type: "error",
        message:
          "Could not save your comment. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="comments-section"
      aria-labelledby="comments-title"
    >
      {/* =============================================
          SECTION HEADING
      ============================================== */}

      <div className="comments-heading">
        <div>
          <span className="comments-eyebrow">
            LEAVE A MESSAGE
          </span>

          <h3 id="comments-title">
            Comments
            <span>({total})</span>
          </h3>
        </div>

        <p>
          Have a thought, suggestion, or just want
          to say hello? Leave a comment below.
        </p>
      </div>

      <div className="comments-layout">
        {/* =========================================
            COMMENT FORM
        ========================================== */}

        <form
          className="comments-form"
          onSubmit={handleSubmit}
        >
          <div className="comments-form-heading">
            <MessageSquare
              size={19}
              aria-hidden="true"
            />

            <h4>Write a comment</h4>
          </div>

          {/* NAME */}

          <div className="comments-field">
            <label htmlFor="comment-name">
              NAME
            </label>

            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your name"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              disabled={submitting}
            />
          </div>

          {/* COMMENT */}

          <div className="comments-field">
            <label htmlFor="comment-body">
              COMMENT
            </label>

            <textarea
              id="comment-body"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder="Write your comment here..."
              rows={5}
              minLength={1}
              maxLength={1200}
              required
              disabled={submitting}
            />

            <span className="comments-character-count">
              {comment.length}/1200
            </span>
          </div>

          {/* OPTIONAL PROFILE PHOTO */}

          <div className="comments-field">
            <label htmlFor="comment-photo">
              PROFILE PHOTO (OPTIONAL)
            </label>

            <input
              ref={fileInputRef}
              className="comments-file-input"
              id="comment-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={submitting}
            />

            <label
              htmlFor="comment-photo"
              className="comments-upload"
            >
              <ImagePlus
                size={19}
                aria-hidden="true"
              />

              <span>
                {photo
                  ? "Change Profile Photo"
                  : "Choose Profile Photo"}
              </span>
            </label>

            <span className="comments-file-note">
              Max file size: 5 MB · JPG, PNG or WebP
            </span>

            {photo && (
              <div className="comments-selected-photo">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Selected profile preview"
                  />
                )}

                <span>{photo.name}</span>

                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={submitting}
                  aria-label="Remove selected photo"
                >
                  <X
                    size={16}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )}
          </div>

          {/* STATUS */}

          {submitStatus.message && (
            <p
              className={`comments-status comments-status--${submitStatus.type}`}
              role={
                submitStatus.type === "error"
                  ? "alert"
                  : "status"
              }
            >
              {submitStatus.message}
            </p>
          )}

          {/* SUBMIT */}

          <button
            className="comments-submit"
            type="submit"
            disabled={submitting || !supabase}
          >
            <span>
              {submitting
                ? "Saving comment..."
                : "Submit a Comment"}
            </span>

            <Send
              size={17}
              aria-hidden="true"
            />
          </button>
        </form>

        {/* =========================================
            SAVED COMMENTS
        ========================================== */}

        <div className="comments-feed">
          <div className="comments-feed-heading">
            <h4>Community comments</h4>

            <span>
              {total} {total === 1 ? "comment" : "comments"}
            </span>
          </div>

          {loading && comments.length === 0 ? (
            <div className="comments-empty">
              Loading comments...
            </div>
          ) : loadError && comments.length === 0 ? (
            <div
              className="comments-empty"
              role="status"
            >
              {loadError}
            </div>
          ) : comments.length === 0 ? (
            <div className="comments-empty">
              <MessageSquare
                size={27}
                aria-hidden="true"
              />

              <strong>No comments yet.</strong>

              <p>
                Be the first to leave a message.
              </p>
            </div>
          ) : (
            <>
              <ol className="comments-list">
                {comments.map((item) => (
                  <li
                    className="comment-item"
                    key={item.id}
                  >
                    <CommentAvatar
                      name={item.name}
                      path={item.avatar_path}
                    />

                    <div className="comment-content">
                      <div className="comment-meta">
                        <strong>
                          {item.name}
                        </strong>

                        <time
                          dateTime={item.created_at}
                        >
                          {formatDate(item.created_at)}
                        </time>
                      </div>

                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {total > MAX_VISIBLE_COMMENTS && (
                <p className="comments-more-note">
                  Showing the latest
                  {" "}{MAX_VISIBLE_COMMENTS} comments.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
