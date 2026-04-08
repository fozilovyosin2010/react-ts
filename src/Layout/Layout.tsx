import React from "react";
import { Input } from "@/components/ui/input";
import { Outlet } from "react-router";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Layout = () => {
  return (
    <div>
      <div className="header p-[10px_20px] border-b">
        <div className="sec flex justify-between">
          <div className="flex gap-3">
            <Input placeholder="Enter text" />
            <Select>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button>Add</Button>
        </div>
      </div>
      <Outlet />
      <div className="footer"></div>
    </div>
  );
};

export default Layout;
