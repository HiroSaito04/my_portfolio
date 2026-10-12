export async function copyToClipboard(
  value,
) {
  if (
    !navigator.clipboard?.writeText
  ) {
    return false
  }

  try {
    await navigator.clipboard.writeText(
      value,
    )

    return true
  } catch {
    return false
  }
}