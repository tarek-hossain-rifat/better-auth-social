"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth-client";
import { FloppyDisk, Eye, EyeSlash } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  TextField,
  toast,
  InputGroup,
} from "@heroui/react";
import React from "react";
import { useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVisibleNewPass, setIsVisibleNewPass] = useState(false);

  if (!token) {
    return <p>Invalid or missing password reset token.</p>;
  }

  const passwordChange = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // alert("Form submitted successfully!");

    const { data: updatedPassword, error } = await resetPassword({
      newPassword: data.newPassword,
      token,
    });

    if (error) {
      toast("Failed to reset password", {
        description: error.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
      return;
    }

    toast("Password reset successfully!", {
      description: `Your password has been reset.`,
      variant: "success",
      timeout: 4000, // Auto-dismiss after 4 seconds
    });

    console.log("Updated user:", updatedPassword, error);
  };

  return (
    <Form className="w-full max-w-96" onSubmit={passwordChange}>
      <Fieldset>
        <Fieldset.Legend>Profile Settings</Fieldset.Legend>
        <Description>Update your password.</Description>
        <FieldGroup>
            
          <TextField
            isRequired
            name="newPassword"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label>Password</Label>
            <InputGroup>
              <InputGroup.Input
                placeholder="New Password"
                type={isVisibleNewPass ? "text" : "password"}
              />

              <InputGroup.Suffix className="pe-1">
                <Button
                  type="button"
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  aria-label={
                    isVisibleNewPass ? "Hide password" : "Show password"
                  }
                  onPress={() => setIsVisibleNewPass((prev) => !prev)}
                >
                  {isVisibleNewPass ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeSlash className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            <FieldError />
          </TextField>

        </FieldGroup>
        <Fieldset.Actions>
          <Button type="submit">
            <FloppyDisk />
            Change Password
          </Button>
          <Button type="reset" variant="secondary">
            Cancel
          </Button>
        </Fieldset.Actions>
      </Fieldset>
    </Form>
  );
};

export default ResetPasswordForm;
