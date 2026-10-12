import {
  services,
} from '../../config/site'

import {
  SectionHeading,
} from '../common/SectionHeading'

import {
  ServiceCard,
} from '../common/ServiceCard'

export function ServicesSection() {
  return (
    <section
      className="content-section"
      id="services"
    >
      <SectionHeading
        number="02"
        title="What I help businesses do"
        subtitle="Technical work tied to a practical business outcome."
      />

      <div className="service-grid">
        {services.map(
          (service) => (
            <ServiceCard
              key={service.number}
              service={service}
            />
          ),
        )}
      </div>
    </section>
  )
}