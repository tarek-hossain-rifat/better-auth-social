
import { Suspense } from "react";

import React from "react";
import ResetPasswordPageForm from "./reset-form";

const ResetPasswordPage = () => {

  return (
    <Suspense fallback="Loading...">
      <ResetPasswordPageForm></ResetPasswordPageForm>
    </Suspense>
  );
};

export default ResetPasswordPage;
