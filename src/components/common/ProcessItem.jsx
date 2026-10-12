//src\components\common\ProcessItem.jsx

export function ProcessItem({
  number,
  title,
  text,
}) {
  return (
    <div className="process-item">
      <span>{number}</span>

      <div>
        <strong>{title}</strong>

        <p>{text}</p>
      </div>
    </div>
  )
}