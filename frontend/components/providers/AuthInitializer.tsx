"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { restoreUser } from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("campushub_user");

    if (savedUser) {
      dispatch(restoreUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  return null;
}