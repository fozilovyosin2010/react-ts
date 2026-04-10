import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./Store/Store";
import { delData } from "./Reducers/userSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const App = () => {
  const { data } = useSelector((store: RootState) => store.users);

  const dispatch = useDispatch();
  console.log(data);

  function handleClickDel(id: number) {
    dispatch(delData(id));
  }

  const [openAdd, setOpenSAdd] = useState(false);
  function hanClickOpenAdd() {}

  return (
    <div className="p-[10px_20px]">
      <header className="py-2">
        <button onClick={hanClickOpenAdd} className="bg-blue-500 text-[#fff]">
          Add
        </button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => {
            return (
              <tr>
                <td>{e.name}</td>
                <td>{e.status ? "ACTIVE" : "INACTIVE"}</td>
                <td>
                  <div>
                    <button
                      onClick={() => handleClickDel(e.id)}
                      className="border border-[red]"
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
