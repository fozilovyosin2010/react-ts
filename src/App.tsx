import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./Store/Store";
import { addData, delData } from "./Reducers/userSlice";

import * as Yup from "yup";

import { Formik, useFormik } from "formik";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const App = () => {
  const { data } = useSelector((store: RootState) => store.users);

  const dispatch = useDispatch();

  function handleClickDel(id: number) {
    dispatch(delData(id));
  }

  const [openAdd, setOpenAdd] = useState(false);
  function hanClickOpenAdd() {
    setOpenAdd(true);
  }

  function hanClickCloseAdd() {
    setOpenAdd(false);
  }

  const addSchema = Yup.object({
    name: Yup.string().trim().required("fill the field"),
  });

  const formikAdd = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: addSchema,
    onSubmit: (val, { resetForm }) => {
      const obj = { id: new Date().getTime(), status: false, ...val };

      dispatch(addData(obj));

      resetForm();
      hanClickCloseAdd();
    },
  });

  return (
    <div className="p-[10px_20px]">
      <header className="py-2">
        <Button onClick={hanClickOpenAdd} className="bg-blue-500 text-[#fff]">
          Add
        </Button>
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
              <tr key={e.id}>
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
      <Dialog open={openAdd} onOpenChange={(e) => setOpenAdd(e)}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={formikAdd.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add </DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <input
                onBlur={formikAdd.handleBlur}
                className="border w-full p-[10px_20px]"
                value={formikAdd.values.name}
                onChange={formikAdd.handleChange}
                name="name"
                placeholder="Name"
              />
            </div>

            {formikAdd.errors.name && formikAdd.touched.name && (
              <p className="text-[red]">{formikAdd.errors.name}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
