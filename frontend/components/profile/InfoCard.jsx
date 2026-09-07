'use client'

export default function InfoCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon size={20} className="text-[#2d7d46]" />}
        <h3 className="font-semibold text-[#2d2d2d]">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}