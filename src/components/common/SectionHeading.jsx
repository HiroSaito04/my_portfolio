//D:\Mike_Portfolio\src\components\common\SectionHeading.jsx

export function SectionHeading({
  number,
  title,
  subtitle,
}) {
  return (
    <div
      className="section-heading"
      data-reveal
    >
      <div className="section-number">
        {number} —
      </div>

      <div>
        <h2>{title}</h2>

        <p>{subtitle}</p>
      </div>
    </div>
  )
}