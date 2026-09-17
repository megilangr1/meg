"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { doAlert } from "@/helpers/client/client.helper";
import { authClient } from "@/lib/auth-client";
import { AuthLoginForm, authLoginSchema } from "@/modules/auth/login.schema";
import {
  LOGIN_NETWORK_ERROR_MESSAGE,
  getLoginErrorMessage,
} from "@/modules/auth/login.errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const defaultValues: AuthLoginForm = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthLoginForm>({
    resolver: zodResolver(authLoginSchema),
    defaultValues,
  });

  async function onSubmit(formData: AuthLoginForm) {
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: false,
        callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            doAlert("Login berhasil", 1);
            router.push("/dashboard");
            router.refresh();
          },
        },
      });

      if (error) {
        doAlert(getLoginErrorMessage(error.code));
        return;
      }
    } catch (error) {
      console.warn(error);
      doAlert(LOGIN_NETWORK_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="auth-login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                type="email"
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@mail.com"
                autoComplete="email"
                required
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                type="password"
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="*********"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Field>
        <Button
          type="submit"
          form="auth-login-form"
          size={"lg"}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          Login
        </Button>

        <Link href={"/"} className="w-full mt-2">
          <FieldSeparator childClass="bg-muted px-4">
            Back to Landing Page
          </FieldSeparator>
        </Link>
      </Field>
    </form>
  );
};

export default LoginForm;
