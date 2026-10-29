"use client";

import { useState } from "react";
import { changePassword, updateUser } from "@/lib/auth-client";
import { FloppyDisk, Eye, EyeSlash } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
  InputGroup,
} from "@heroui/react";

export default function ProfilePage() {
  const [isVisibleOldPass, setIsVisibleOldPass] = useState(false);
  const [isVisibleNewPass, setIsVisibleNewPass] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // alert("Form submitted successfully!");

    const { data: updatedUser, error } = await updateUser({
      name: data.name,
    });

    if (error) {
      toast("Failed to update profile", {
        description: error.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
      return;
    }

    toast("Profile updated successfully!", {
      description: `Your name has been updated to ${data.name}.`,
      variant: "success",
      timeout: 4000, // Auto-dismiss after 4 seconds
    });

    console.log("Updated user:", updatedUser, error);
  };

  const passwordChange = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // alert("Form submitted successfully!");

    const { data: updatedPassword, error } = await changePassword({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true, // Optional: Revoke all sessions after password change
    });

    if (error) {
      toast("Failed to update password", {
        description: error.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
      return;
    }

    toast("Password updated successfully!", {
      description: `Your password has been updated.`,
      variant: "success",
      timeout: 4000, // Auto-dismiss after 4 seconds
    });

    console.log("Updated user:", updatedPassword, error);
  };


  return (
    <>
      <Form className="w-full max-w-96" onSubmit={onSubmit}>
        <Fieldset>
          <Fieldset.Legend>Profile Settings</Fieldset.Legend>
          <Description>Update your profile name.</Description>
          <FieldGroup>
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 3) {
                  return "Name must be at least 3 characters";
                }

                return null;
              }}
            >
              <Label>Name</Label>
              <Input placeholder="John Doe" />
              <FieldError />
            </TextField>
          </FieldGroup>
          <Fieldset.Actions>
            <Button type="submit">
              <FloppyDisk />
              Change Name
            </Button>
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>
      </Form>
      <br />
      <Form className="w-full max-w-96" onSubmit={passwordChange}>
        <Fieldset>
          <Fieldset.Legend>Profile Settings</Fieldset.Legend>
          <Description>Update your password.</Description>
          <FieldGroup>
            <TextField
              isRequired
              name="currentPassword"
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
                  placeholder="Old Password"
                  type={isVisibleOldPass ? "text" : "password"}
                />

                <InputGroup.Suffix className="pe-1">
                  <Button
                    type="button"
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={
                      isVisibleOldPass ? "Hide password" : "Show password"
                    }
                    onPress={() => setIsVisibleOldPass((prev) => !prev)}
                  >
                    {isVisibleOldPass ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeSlash className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>

              <FieldError />
            </TextField>

            <TextField
              isRequired
              name="newPassword"
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
    </>
  );
}
