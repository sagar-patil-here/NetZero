import React from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, Zap, Database, BarChart3 } from 'lucide-react'
import { ScrollFloat } from '@/components/ui/scroll-float'

const Stats = () => {

  const stats = [
    {
      icon: TrendingDown,
      value: '85%',
      label: 'Reduction in Manual Tracking',
      description: 'Automated ERP integration eliminates manual data entry'
    },
    {
      icon: Zap,
      value: 'Real-time',
      label: 'Emission Calculations',
      description: 'Instant CO₂ calculations as data enters your system'
    },
    {
      icon: Database,
      value: '99.9%',
      label: 'Data Accuracy',
      description: 'Scientifically verified emission factors from IPCC'
    },
    {
      icon: BarChart3,
      value: '24/7',
      label: 'Monitoring Dashboard',
      description: 'Continuous tracking across all emission scopes'
    }
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="mb-6"
            textClassName="text-4xl md:text-5xl font-bold text-white"
            stagger={0.02}
            delay={0.2}
          >
            Trusted by Industry Leaders
          </ScrollFloat>
          <ScrollFloat
            textClassName="text-xl text-carbon-300"
            stagger={0.01}
            delay={0.6}
          >
            Join companies worldwide making sustainability measurable
          </ScrollFloat>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
              className="glass-effect rounded-2xl p-8 text-center group hover:bg-black/20 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2 gradient-text">
                {stat.value}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {stat.label}
              </h3>
              <p className="text-carbon-300 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
