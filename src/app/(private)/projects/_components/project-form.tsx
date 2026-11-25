"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { doAlert } from "@/helpers/client/client.helper";
import { PROJECT_NETWORK_ERROR_MESSAGE } from "@/modules/project/project.errors";
import {
  projectFormSchema,
  slugify,
  type ProjectFormValues,
} from "@/modules/project/project.schema";

import { createProject, updateProject } from "../actions";

type ProjectFormProps =
  | { mode: "create" }
  | { mode: "edit"; projectId: string; defaultValues: ProjectFormValues };

const EMPTY: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  role: "",
  year: "",
  techStack: "",
  status: "draft",
  sortOrder: "0",
};

const SUMMARY_MAX = 320;
const DESCRIPTION_MAX = 20000;

export function ProjectForm(props: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const slugTouched = useRef(false);
  const isCreate = props.mode === "create";

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onTouched",
    defaultValues: props.mode === "edit" ? props.defaultValues : EMPTY,
  });

  const [status, summary, description] = useWatch({
    control: form.control,
    name: ["status", "summary", "description"],
  });
  const summaryLength = summary.length;
  const descriptionLength = description.length;

  async function onSubmit(values: ProjectFormValues) {
    setIsLoading(true);
    try {
      const result = isCreate
        ? await createProject(values)
        : await updateProject(props.projectId, values);

      if (!result.ok) {
        doAlert(result.message);
        return;
      }

      doAlert(isCreate ? "Project dibuat — lanjut isi aset" : "Project diperbarui", 1);
      router.push(result.id ? `/projects/${result.id}` : "/projects");
      router.refresh();
    } catch (error) {
      console.warn(error);
      doAlert(PROJECT_NETWORK_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form id="project-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <FieldSet>
          <FieldLegend>Info dasar</FieldLegend>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-title">Judul</FieldLabel>
                  <Input
                    {...field}
                    id="project-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="cth: SaaS analytics dashboard"
                    autoComplete="off"
                    disabled={isLoading}
                    onChange={(event) => {
                      field.onChange(event);
                      if (!slugTouched.current)
                        form.setValue("slug", slugify(event.target.value));
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-slug">Slug</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="project-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="saas-analytics-dashboard"
                      autoComplete="off"
                      disabled={isLoading}
                      onChange={(event) => {
                        slugTouched.current = true;
                        field.onChange(event);
                      }}
                    />
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>/work/</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {!fieldState.invalid && (
                    <FieldDescription>
                      Mengikuti judul sampai kamu ubah sendiri — dipakai di URL publik.
                    </FieldDescription>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="summary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-summary">Ringkasan</FieldLabel>
                  <Textarea
                    {...field}
                    id="project-summary"
                    aria-invalid={fieldState.invalid}
                    placeholder="Satu sampai dua kalimat untuk kartu dan meta description."
                    rows={2}
                    disabled={isLoading}
                  />
                  <FieldDescription className="flex justify-between gap-2">
                    <span>Tampil di kartu project dan meta description.</span>
                    <span
                      className={summaryLength > SUMMARY_MAX ? "text-destructive" : undefined}
                    >
                      {summaryLength}/{SUMMARY_MAX}
                    </span>
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-description">Deskripsi</FieldLabel>
                  <Textarea
                    {...field}
                    id="project-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Paragraf panjang. Pisahkan paragraf dengan baris kosong."
                    rows={8}
                    disabled={isLoading}
                  />
                  <FieldDescription className="flex justify-between gap-2">
                    <span>Teks biasa — baris kosong jadi paragraf baru.</span>
                    <span
                      className={
                        descriptionLength > DESCRIPTION_MAX ? "text-destructive" : undefined
                      }
                    >
                      {descriptionLength}/{DESCRIPTION_MAX}
                    </span>
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Detail</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-role">Peran</FieldLabel>
                  <Input
                    {...field}
                    id="project-role"
                    aria-invalid={fieldState.invalid}
                    placeholder="cth: Full-stack build"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-year">Tahun</FieldLabel>
                  <Input
                    {...field}
                    id="project-year"
                    aria-invalid={fieldState.invalid}
                    placeholder="2026"
                    inputMode="numeric"
                    maxLength={4}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="techStack"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                  <FieldLabel htmlFor="project-tech-stack">Teknologi</FieldLabel>
                  <Input
                    {...field}
                    id="project-tech-stack"
                    aria-invalid={fieldState.invalid}
                    placeholder="Next.js, Prisma, MySQL"
                    disabled={isLoading}
                  />
                  {!fieldState.invalid && (
                    <FieldDescription>Pisahkan dengan koma.</FieldDescription>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Publikasi</FieldLegend>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldLabel htmlFor="project-status" className="flex items-center gap-2">
                      Terbitkan
                      <Badge variant={status === "published" ? "default" : "outline"}>
                        {status === "published" ? "Terbit" : "Draft"}
                      </Badge>
                    </FieldLabel>
                    <FieldDescription>
                      Draft tidak tampil di halaman publik.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="project-status"
                    checked={field.value === "published"}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? "published" : "draft")
                    }
                    disabled={isLoading}
                  />
                </Field>
              )}
            />

            <Controller
              name="sortOrder"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="project-sort-order">Urutan</FieldLabel>
                  <Input
                    {...field}
                    id="project-sort-order"
                    aria-invalid={fieldState.invalid}
                    inputMode="numeric"
                    maxLength={4}
                    disabled={isLoading}
                  />
                  {!fieldState.invalid && (
                    <FieldDescription>Angka kecil tampil lebih dulu.</FieldDescription>
                  )}
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </div>

      <Field
        orientation="horizontal"
        className="sticky bottom-0 justify-end gap-2 border-t bg-background/95 p-4 backdrop-blur sm:px-6"
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" form="project-form" disabled={isLoading}>
          {isLoading && <Spinner data-icon="inline-start" />}
          {isCreate ? "Tambah Project" : "Simpan Perubahan"}
        </Button>
      </Field>
    </form>
  );
}
