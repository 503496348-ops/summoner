"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useOAuth } from "@/lib/useOAuth"

function Login() {
  const { login } = useOAuth({ debug: false })
  return <Button onClick={login} className="text-xl">登录</Button>
}

export default Login