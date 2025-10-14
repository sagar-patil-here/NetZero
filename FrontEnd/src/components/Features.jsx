import React from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Zap, 
  BarChart3, 
  Shield, 
  Plug, 
  TrendingUp,
  Globe,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { ScrollFloat } from '@/components/ui/scroll-float'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const Features = () => {

  const features = [
    {
      icon: Database,
      title: 'ERP Integration',
      description: 'Seamlessly connects to Odoo, ERPNext, and other ERP systems for automatic data ingestion of fuel, electricity, and transport logs.',
      details: [
        'Real-time API connections',
        'Automatic data synchronization',
        'No manual uploads required',
        'Multi-ERP support'
      ]
    },
    {
      icon: Zap,
      title: 'Emission Engine',
      description: 'Uses scientifically verified emission factors from IPCC and GHG Protocol to calculate Scope 1, 2, and 3 emissions accurately.',
      details: [
        'IPCC emission factors',
        'Scope 1, 2, 3 calculations',
        'CO₂e conversion',
        'Scientific accuracy'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Interactive dashboards display total daily, weekly, and monthly CO₂e with breakdowns by department and activity type.',
      details: [
        'Real-time visualizations',
        'Department-wise breakdown',
        'Trend analysis',
        'Interactive charts'
      ]
    },
    {
      icon: Shield,
      title: 'Data Processing',
      description: 'Robust data normalization and storage in PostgreSQL/SQLite with comprehensive trend analysis capabilities.',
      details: [
        'Data normalization',
        'Secure storage',
        'Trend analysis',
        'Historical tracking'
      ]
    },
    {
      icon: Plug,
      title: 'API Integration',
      description: 'Comprehensive APIs for external use including real-time emission data, activity breakdowns, and threshold alerts.',
      details: [
        '/api/emissions/today',
        '/api/activities',
        '/api/alerts',
        'RESTful endpoints'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Automated alerts when emissions exceed predefined thresholds, enabling proactive sustainability management.',
      details: [
        'Threshold monitoring',
        'Real-time alerts',
        'Customizable limits',
        'Multi-channel notifications'
      ]
    }
  ]

  return (
    <section id="features" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="mb-2"
            textClassName="text-4xl md:text-5xl font-bold text-white"
            stagger={0.02}
            delay={0.3}
          >
            Powerful Features for
          </ScrollFloat>
          <ScrollFloat
            containerClassName="mb-6"
            textClassName="text-4xl md:text-5xl font-bold gradient-text"
            stagger={0.02}
            delay={0.7}
          >
            Carbon Management
          </ScrollFloat>
          <ScrollFloat
            textClassName="text-xl text-carbon-300"
            stagger={0.01}
            delay={1.1}
          >
            Everything you need to track, analyze, and reduce
          </ScrollFloat>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 + index * 0.1 }}
              className="glass-effect rounded-2xl p-8 group hover:bg-black/20 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-carbon-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-3 text-carbon-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="text-center mt-16"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <Globe className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Carbon Tracking?
            </h3>
            <p className="text-carbon-300 mb-8 text-lg">
              Join forward-thinking companies who are making sustainability measurable and actionable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div onClick={() => console.log('Start Free Trial clicked')}>
                <InteractiveHoverButton
                  text="Start Free Trial"
                  className="text-base"
                />
              </div>
              <div onClick={() => console.log('Schedule Demo clicked')}>
                <InteractiveHoverButton
                  text="Schedule Demo"
                  className="text-base"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
