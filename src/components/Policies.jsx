import React from 'react'

export const POLICY_CONTENT = {
  terms: {
    title: 'Terms and Conditions',
    content: (
      <>
        <p>Welcome to Youth Seminar. By accessing our website and registering for our events, you agree to comply with and be bound by the following terms and conditions.</p>
        
        <h4>1. Registration and Payment</h4>
        <p>Registration is confirmed only upon successful payment of the registration fee. The fee is non-transferable unless otherwise stated.</p>
        
        <h4>2. Event Conduct</h4>
        <p>Attendees are expected to behave respectfully towards speakers, organizers, and other participants. Disruptive behavior may result in expulsion from the event without refund.</p>
        
        <h4>3. Intellectual Property</h4>
        <p>All content provided during the seminar, including materials and presentations, is the intellectual property of the organizers or speakers and may not be recorded or reproduced without permission.</p>
        
        <h4>4. Limitation of Liability</h4>
        <p>The organizers are not liable for any personal injury, loss, or damage to property during the event, except where required by law.</p>
        
        <h4>5. Changes to Event</h4>
        <p>We reserve the right to make changes to the event schedule, speakers, or venue if necessary. Registered participants will be notified of significant changes.</p>
      </>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <>
        <p>We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.</p>
        
        <h4>1. Information Collection</h4>
        <p>We collect personal information such as your name, email address, phone number, and age when you register for our events. This information is used solely for event coordination and communication.</p>
        
        <h4>2. Use of Information</h4>
        <p>Your information is used to process your registration, send event updates, and verify your identity at the venue. We do not sell or share your data with third parties for marketing purposes.</p>
        
        <h4>3. Data Security</h4>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
        
        <h4>4. Cookies</h4>
        <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>
      </>
    )
  },
  refund: {
    title: 'Refund and Cancellation Policy',
    content: (
      <>
        <p>We understand that plans can change. Please review our refund and cancellation policy below.</p>
        
        <h4>1. Cancellation by Participant</h4>
        <p>Cancellations made 7 days or more in advance of the event date will receive a 100% refund. Cancellations made within 3 - 6 days will incur a 20% fee. No refunds will be issued for cancellations made within 48 hours of the event.</p>
        
        <h4>2. Cancellation by Organizer</h4>
        <p>If the event is cancelled by the organizers for any reason, registered participants will receive a full refund of the registration fee.</p>
        
        <h4>3. Refund Processing</h4>
        <p>Refunds will be processed within 5-7 business days to the original method of payment.</p>
      </>
    )
  },
  contact: {
    title: 'Contact Us',
    content: (
      <>
        <p>If you have any questions or concerns regarding these policies or the event, please contact us at:</p>
        
        <p><strong>Email:</strong> support@youthseminar.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Address:</strong> 123 Seminar Hall, Knowledge Park, Ahmedabad, Gujarat, India</p>
      </>
    )
  }
}

export function PoliciesModal({ type, onClose }) {
  if (!type || !POLICY_CONTENT[type]) return null

  const { title, content } = POLICY_CONTENT[type]

  return (
    <div className="modal open" role="dialog" aria-modal="true" style={{ zIndex: 2000 }}>
      <div className="modal-sheet policy-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3>{title}</h3>
        <div className="policy-content">
          {content}
        </div>
        <div className="form-actions">
            <button className="register" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
