"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { doAlert } from "@/helpers/client/client.helper";
import { authClient } from "@/lib/auth-client";
import {
  USER_ROLE,
  createUserSchema,
  updateUserSchema,
  type CreateUserForm,
  type UpdateUserForm,
} from "@/modules/user/user.schema";
import {
  USER_NETWORK_ERROR_MESSAGE,
  getUserErrorMessage,
} from "@/modules/user/user.errors";

type UserFormProps =
  | { mode: "create" }
  | {
      mode: "edit";
      userId: string;
      defaultValues: { name: string; email: string };
    };

export function UserForm(props: UserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isCreate = props.mode === "create";

  const form = useForm<CreateUserForm | UpdateUserForm>({
    resolver: zodResolver(isCreate ? createUserSchema : updateUserSchema),
    defaultValues:
      props.mode === "edit"
        ? { name: props.defaultValues.name, email: props.defaultValues.email, password: "" }
        : { name: "", email: "", password: "" },
  });

  async function onSubmit(formData: CreateUserForm | UpdateUserForm) {
    setIsLoading(true);
    try {
      if (isCreate) {
        const data = formData as CreateUserForm;
        const { error } = await authClient.admin.createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: USER_ROLE,
        });
        if (error) {
          doAlert(getUserErrorMessage(error.code));
          return;
        }
        doAlert(`Pengguna ${data.name} dibuat`, 1);
      } else {
        const data = formData as UpdateUserForm;
        const { userId } = props;
        const { error } = await authClient.admin.updateUser({
          userId,
          data: { name: data.name, email: data.email },
        });
        if (error) {
          doAlert(getUserErrorMessage(error.code));
          return;
        }
        // ponytail: tanpa refine lintas-field — cek manual, upgrade ke superRefine bila aturan tumbuh.
        if (data.password && data.password.length > 0) {
          const { error: pwError } = await authClient.admin.setUserPassword({
            userId,
            newPassword: data.password,
          });
          if (pwError) {
            doAlert(getUserErrorMessage(pwError.code));
            return;
          }
        }
        doAlert(`Pengguna ${data.name} diperbarui`, 1);
      }
      router.push("/akun-pengguna");
      router.refresh();
    } catch (err) {
      console.warn(err);
      doAlert(USER_NETWORK_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id={isCreate ? "user-create-form" : "user-edit-form"}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6 p-4 sm:p-6"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="user-name">Nama lengkap</FieldLabel>
              <Input
                {...field}
                type="text"
                id="user-name"
                aria-invalid={fieldState.invalid}
                placeholder="cth: Budi Santoso"
                autoComplete="name"
                required
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="user-email">Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id="user-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="pengguna@mail.com"
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
                <FieldLabel htmlFor="user-password">
                  {isCreate ? "Password" : "Password baru"}
                </FieldLabel>
                <Input
                  {...field}
                  type="password"
                  id="user-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  required={isCreate}
                  disabled={isLoading}
                />
                {!fieldState.invalid && !isCreate && (
                  <FieldDescription>
                    Kosongkan bila password tidak diubah.
                  </FieldDescription>
                )}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Field orientation="horizontal" className="justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          type="submit"
          form={isCreate ? "user-create-form" : "user-edit-form"}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          {isCreate ? "Tambah Pengguna" : "Simpan Perubahan"}
        </Button>
      </Field>
    </form>
  );
}
