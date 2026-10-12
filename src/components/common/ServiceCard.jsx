//src\components\common\ServiceCard.jsx

import { ChevronRight } from 'lucide-react'

import { ServiceIcon } from './ServiceIcon'

export function ServiceCard({
  service,
}) {
  return (
    <article
      className="service-card"
      data-reveal
    >
      <div className="service-top">
        <span>
          {service.number}
        </span>

        <ServiceIcon
          name={service.icon}
        />
      </div>

      <h3>{service.title}</h3>

      <p>{service.text}</p>

      <span className="service-arrow">
        <ChevronRight size={17} />
      </span>
    </article>
  )
}