//src\components\common\StackGroup.jsx

export function StackGroup({
  title,
  items,
}) {
  return (
    <div className="stack-group">
      <span>{title}</span>

      <div>
        {items.map((item) => (
          <strong key={item}>
            {item}
          </strong>
        ))}
      </div>
    </div>
  )
}