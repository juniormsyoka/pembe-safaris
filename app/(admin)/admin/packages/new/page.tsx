import PackageForm from './PackageForm'

export const metadata = {
  title: 'Create New Package | Admin Dashboard',
  description: 'Create a new safari package'
}

export default function NewPackagePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Safari Package</h1>
        <PackageForm />
      </div>
    </div>
  )
}