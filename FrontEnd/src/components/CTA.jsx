import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react'
import { ScrollFloat } from '@/components/ui/scroll-float'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const CTA = () => {

  const benefits = [
    '30-day free trial',
    'No setup fees',
    '24/7 expert support',
    'Cancel anytime'
  ]

  const testimonials = [
    {
      quote: "CarbonTrack transformed our sustainability reporting. What used to take weeks now happens automatically.",
      author: "Sarah Chen",
      role: "Sustainability Director",
      company: "TechCorp"
    },
    {
      quote: "The real-time insights help us make data-driven decisions about our carbon footprint.",
      author: "Michael Rodriguez",
      role: "Operations Manager",
      company: "Manufacturing Plus"
    }
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <ScrollFloat
            containerClassName="mb-2"
            textClassName="text-4xl md:text-5xl font-bold text-white"
            stagger={0.02}
            delay={0.4}
          >
            Start Your Carbon
          </ScrollFloat>
          <ScrollFloat
            containerClassName="mb-6"
            textClassName="text-4xl md:text-5xl font-bold gradient-text"
            stagger={0.02}
            delay={0.8}
          >
            Tracking Journey
          </ScrollFloat>
          <ScrollFloat
            textClassName="text-xl text-carbon-300"
            stagger={0.01}
            delay={1.2}
          >
            Join hundreds of companies achieving sustainability goals
          </ScrollFloat>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="glass-effect rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Get Started Today
              </h3>
              <p className="text-carbon-300 text-lg mb-6">
                Experience the power of automated carbon tracking with our comprehensive platform
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span className="text-white">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div onClick={() => console.log('Start Free Trial clicked')}>
                <InteractiveHoverButton
                  text="Start Free Trial"
                  className="text-base"
                />
              </div>
              <div onClick={() => console.log('Contact Sales clicked')}>
                <InteractiveHoverButton
                  text="Contact Sales"
                  className="text-base"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-carbon-300 text-sm">
                <Users className="w-4 h-4" />
                <span>Trusted by 500+ companies worldwide</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="space-y-6"
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-carbon-300 mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.author}
                      </div>
                      <div className="text-carbon-400 text-sm">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTA
