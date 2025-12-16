import { Mail, MessageSquare, Send, MapPin, Phone } from "lucide-react";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-20 px-6 md:px-12 lg:px-20 bg-secondary overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-lavender-300 bg-opacity-50 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-lime-100 dark:bg-lime-900/30 rounded-full mb-4">
            <span className="p4 font-semibold text-lime-700 dark:text-lime-300">
              GET IN TOUCH
            </span>
          </div>
          <h2 className="mb-4">
            Let's <span className="text-aqua-600">Start a Conversation</span>
          </h2>
          <p className="p2 text-secondary max-w-2xl mx-auto text-balance">
            Have questions or feedback? We'd love to hear from you. Our team is
            here to help you succeed.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 md:p-10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block sh3 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stroke bg-base text-primary focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition"
                    placeholder="Test Name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block sh3 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-stroke bg-base text-primary focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block sh3 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl border-2 border-stroke bg-base text-primary focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block sh3 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-stroke bg-base text-primary focus:outline-none focus:ring-2 focus:ring-lavender-500 focus:border-transparent resize-none transition"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <PrimaryButton
                  type="submit"
                  className="flex items-center gap-2"
                >
                  SEND MESSAGE
                  <Send size={18} />
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
