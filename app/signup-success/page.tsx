import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccess() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50 to-white">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <Shield className="h-5 w-5" />
          <span className="font-medium">Slim Tax</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <Card className="mx-auto w-full max-w-md shadow-lg border-emerald-100">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Account created successfully!</CardTitle>
            <CardDescription className="text-base mt-2">Please check your email to verify your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center pt-4">
            <p className="text-gray-500">
              We've sent a verification link to your email address. Once verified, you can log in and start using Slim
              Tax.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Link href="/login" passHref>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

