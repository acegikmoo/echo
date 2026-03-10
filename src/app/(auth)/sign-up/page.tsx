"use client";

import { useRef } from "react";
import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Lock, Mail, ShieldCheck, User, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);


  const mutation = useMutation({
    mutationFn: async ({
      name,
      email,
      password
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const response = await authClient.signUp.email({ name, email, password });
      if (response.error) {
        throw new Error(response.error.message || "Failed to create account");
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created!");
      setTimeout(() => router.push("/sign-in"), 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  })

  return (
    <div className="dark min-h-screen relative flex items-center justify-center bg-background overflow-hidden">
      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 border border-primary/20">
            <Zap className="size-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            ECHO
          </span>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl tracking-tight">
              Create your account
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Make website with a prompt
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();

                const password = passwordRef.current!.value;
                const confirmPassword = confirmPasswordRef.current!.value;

                if (password !== confirmPassword) {
                  toast.error("Passwords do not match");
                  return;
                }

                mutation.mutate({
                  name: nameRef.current!.value,
                  email: emailRef.current!.value,
                  password: passwordRef.current!.value
                });
              }}
            >

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <Input
                    id="name"
                    ref={nameRef}
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <Input
                    id="password"
                    ref={passwordRef}
                    type="password"
                    placeholder="Min. 8 characters"
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                  <Input
                    id="confirmPassword"
                    ref={confirmPasswordRef}
                    type="password"
                    placeholder="Repeat your password"
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>

              {mutation.isError && (
                <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3.5 py-3">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    {mutation.error?.message ||
                      "Something went wrong. Please try again."}
                  </span>
                </div>
              )}

              {mutation.isSuccess && (
                <div className="flex items-start gap-2.5 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-3">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                  <span>Account created! Redirecting to sign in...</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-10 mt-2"
                disabled={mutation.isPending || mutation.isSuccess}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-foreground hover:underline underline-offset-4 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-8 leading-relaxed">
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
