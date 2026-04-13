import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Api,
  checkData,
  delData,
  getData,
  postData,
} from "./Reducers/userSlice";

import type { AppDispatch, RootState } from "./Store/Store";

import { Button } from "./components/ui/button";

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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CheckCheckIcon, Edit, Ellipsis } from "lucide-react";

import * as Yup from "yup";
import { useFormik } from "formik";

const App = () => {
  const { data } = useSelector((e: RootState) => e.users);

  const disP = useDispatch<AppDispatch>();

  useEffect(() => {
    disP(getData());
  }, [disP]);

  const hanClDel = useCallback(
    (id: number) => {
      disP(delData(id));
    },
    [disP],
  );

  const formikAdd = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      Images: "",
    },
    validateOnMount: false,
    validate: (values) => {
      interface Ierrors {
        Name?: string;
        Description?: string;
        Images?: string;
      }

      const errors: Ierrors = {};

      if (!values.Name.trim()) {
        errors.Name = "Name is required";
      }
      if (!values.Description.trim()) {
        errors.Description = "Description is required";
      }
      if (!values.Images) {
        errors.Images = "Image is required";
      }

      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("Name", values.Name);
      formData.append("Description", values.Description);
      formData.append("Images", values.Images);
      disP(postData(formData));

      resetForm();
      setOpenAdd(false);
    },
  });

  const [openAdd, setOpenAdd] = useState(false);

  const hanOpenAdd = useCallback(() => {
    setOpenAdd(true);
  }, []);

  const hanClChecked = useCallback(
    (id: number) => {
      disP(checkData(id));
    },
    [disP],
  );

  return (
    <div>
      <div className="header p-[10px_20px] items-center flex justify-between">
        <div className="flex gap-3">
          <input type="text" className="border rounded-[10px] p-[5px_10px]" />
          <select className="border rounded-[10px] p-[5px_10px]">
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <Button onClick={hanOpenAdd}>Add</Button>
      </div>
      <main className="p-[10px_20px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((e) => {
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>
                    <span
                      className={`${e.isCompleted ? "bg-blue-500" : "bg-red-500"} text-[#fff] p-[5px_8px] rounded-[8px] font-[600]`}
                    >
                      {e.isCompleted ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <img
                      className="w-[200px]"
                      src={`${Api}/images/${e.images[0].imageName}`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Ellipsis />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="stroke-[blue] text-[blue]">
                          <Edit />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => hanClChecked(e.id)}
                          className="stroke-[green] text-[green]"
                        >
                          <CheckCheckIcon />
                          <span>Checked</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => hanClDel(e.id)}
                          variant="destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </main>
      {/* add modal */}
      <Dialog open={openAdd} onOpenChange={(e) => setOpenAdd(e)}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={formikAdd.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                {formikAdd.touched.Name && formikAdd.errors.Name && (
                  <p className="text-red-500 text-[12px]">
                    {formikAdd.errors.Name}
                  </p>
                )}
                <input
                  value={formikAdd.values.Name}
                  onBlur={formikAdd.handleBlur}
                  onChange={formikAdd.handleChange}
                  className={`border border-[#ccc] placeholder:font-[700] p-[5px_10px] w-full rounded-[5px] ${formikAdd.touched.Name && formikAdd.errors.Name ? "border-[red]" : null}`}
                  type="text"
                  name="Name"
                  placeholder="Name"
                />
              </div>
              <div>
                {formikAdd.touched.Description &&
                  formikAdd.errors.Description && (
                    <p className="text-red-500 text-[12px]">
                      {formikAdd.errors.Description}
                    </p>
                  )}
                <input
                  onBlur={formikAdd.handleBlur}
                  value={formikAdd.values.Description}
                  onChange={formikAdd.handleChange}
                  className={`border border-[#ccc] placeholder:font-[700] p-[5px_10px] w-full rounded-[5px] ${formikAdd.touched.Description && formikAdd.errors.Description ? "border-[red]" : null}`}
                  type="text"
                  name="Description"
                  placeholder="Description"
                />
              </div>
              <div>
                {formikAdd.touched.Images && formikAdd.errors.Images && (
                  <p className="text-red-500 text-[12px]">
                    {formikAdd.errors.Images}
                  </p>
                )}
                <input
                  type="file"
                  name="Images"
                  onBlur={formikAdd.handleBlur}
                  className="border p-[5px_10px] w-full rounded-[5px]"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    formikAdd.setFieldValue("Images", file);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
