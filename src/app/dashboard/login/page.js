"use client";
import React from "react";
import "./Login.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";
import { Input, Button } from "antd";
import { message } from "antd";
import { Post } from "../../Components/Redux/API";
import Image from "next/image";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [inputfield, setinputfield] = useState({ username: "", password: "" });
  const inputfieldChange = (e) => {
    setinputfield({ ...inputfield, [e.target.name]: e.target.value });
  };
  const [errorMsg, setErrorMsg] = useState({
    status: false,
    msg: "",
    position: "",
  });

  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("Token")) {
      router.push("/dashboard");
    } // eslint-disable-next-line
  }, []);
  const handleLogin = async (values) => {
    setLoading(true); // Start loading state

    if (values.username === "" || values.password === "") {
      message.error("Please Enter all details");
      setLoading(false); // Stop loading state on validation error
      return;
    }

    try {
      const response = await Post({ url: "/user/login/", data: values });
      localStorage.setItem("Token", response.tokens.access);
      router.push("/dashboard");
      console.log(response);
    } catch (error) {
      console.error("Login failed:", error);
      message.error("Please Enter Correct Username or Password");
    } finally {
      setLoading(false); // Stop loading state in both success and error cases
    }
  };

  return (
    <>
      <div id="container" className="overflow-hidden">
        {" "}
      </div>
      <div id="loginform" className="overflow-hidden">
        <Form onFinish={handleLogin}>
          {/* <img src={img1} alt="#" loading="lazy" className="!w-[300px] !m-0" /> */}
          <Image src="/logo.png" width={200} height={80} alt="logo" />
          <div id="inputfields">
            <div className="username h-full w-full relative">
              <Form.Item name="user_name">
                <Input placeholder="Username" />
              </Form.Item>
            </div>

            <div className="username h-full w-full relative">
              <Form.Item name="password">
                <Input.Password placeholder="Password" />
              </Form.Item>
            </div>

            <div>
              <Button
                loading={loading}
                id="log"
                className=" h-full w-full flex justify-center items-center bg-transparent "
                type="primary"
                htmlType="submit"
              >
                Sign In
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
