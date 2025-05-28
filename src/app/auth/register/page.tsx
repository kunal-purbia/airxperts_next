"use client";
import React, { useEffect, useState } from "react";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  return (
    <div>
      <h2>Registration Form</h2>
    </div>
  );
};

export default Register;
