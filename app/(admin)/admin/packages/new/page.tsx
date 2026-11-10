// app/(admin)/admin/packages/new/page.tsx
import PackageForm from './PackageForm'

export const metadata = {
  title: 'Create New Package | Admin Dashboard',
  description: 'Create a new safari package'
}

export default function NewPackagePage() {
  return (
    <div className="min-h-screen bg-[#FAF2EB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* The inner PackageForm component handles the Title and Header */}
        <PackageForm />
      </div>
    </div>
  )
}