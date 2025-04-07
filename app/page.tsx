import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Shield, MessageSquare, Upload, Sparkles, BarChart3, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Slim Tax</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" passHref>
              <Button variant="ghost" className="font-medium">
                Login
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 border-b">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    <Sparkles className="mr-1 h-3 w-3" /> AI-Powered Tax Strategy
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Personal AI Tax Strategist!
                  </h1>
                  <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[600px]">
                    Slim Tax uses advanced AI to help you optimize your tax strategy, find deductions, and save money
                    without the complexity.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup" passHref>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/learn-more" passHref>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-30 blur-xl"></div>
                  <img
                    src="/placeholder.svg?height=400&width=500"
                    alt="Slim Tax Dashboard Preview"
                    className="relative rounded-lg object-cover border shadow-lg"
                    width={500}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px]">
                <Badge className="mb-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Simple Process</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Slim Tax Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform makes tax optimization simple and effective
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              <Card className="relative overflow-hidden border-emerald-100 bg-white shadow-md transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-6 -translate-y-6 bg-emerald-600 opacity-20 rounded-full blur-2xl"></div>
                <CardHeader className="pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-2">
                    <MessageSquare className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Chat with AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Ask questions about your taxes and get personalized advice from our AI tax strategist.
                  </p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    Step 1
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="relative overflow-hidden border-emerald-100 bg-white shadow-md transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-6 -translate-y-6 bg-emerald-600 opacity-20 rounded-full blur-2xl"></div>
                <CardHeader className="pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-2">
                    <Upload className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Securely upload your tax documents for analysis and recommendations.</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    Step 2
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="relative overflow-hidden border-emerald-100 bg-white shadow-md transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 h-20 w-20 translate-x-6 -translate-y-6 bg-emerald-600 opacity-20 rounded-full blur-2xl"></div>
                <CardHeader className="pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-2">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">Save Money</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Discover deductions and strategies to minimize your tax burden and maximize returns.
                  </p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    Step 3
                  </Badge>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Benefits</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Choose Slim Tax?</h2>
                  <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our platform offers unique advantages for individuals and businesses
                  </p>
                </div>

                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Clock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Save Time</h3>
                      <p className="text-sm text-gray-500">
                        Get instant answers to your tax questions without waiting for an appointment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Maximize Deductions</h3>
                      <p className="text-sm text-gray-500">
                        Our AI identifies deductions and credits you might have missed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Personalized Strategy</h3>
                      <p className="text-sm text-gray-500">
                        Get tax advice tailored to your specific financial situation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Card className="w-full max-w-md border-emerald-100 shadow-xl">
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-2xl">Ready to optimize your taxes?</CardTitle>
                    <CardDescription>Join thousands of users saving money with Slim Tax</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm">AI-powered tax advice available 24/7</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm">Secure document storage and management</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm">Personalized deduction recommendations</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <p className="text-sm">Regular updates on tax law changes</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pt-4">
                    <Link href="/signup" passHref>
                      <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md">
                        Sign Up Now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 md:py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold">Slim Tax</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered tax strategy and optimization for individuals and businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-500 hover:text-emerald-600">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 Slim Tax. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

