import TwoFactorForm from './TwoFactorForm'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md px-4 py-8">
        <TwoFactorForm />
      </div>
    </div>
  )
}