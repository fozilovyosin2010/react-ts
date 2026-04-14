import React, { useEffect, useMemo, useState } from "react";

import { CheckCheckIcon, Delete, Edit, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  checkData,
  delData,
  getData,
  loadTodo,
  postData,
  putData,
  todo,
  type IObjTodo,
} from "./Store/atoms";
import { Spinner } from "./components/ui/spinner";
import { useFormik } from "formik";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const Api = "http://37.27.29.18:8001";

const App = () => {
  const [users] = useAtom(todo);
  const loader = useAtomValue(loadTodo);

  const getUser = useSetAtom(getData);
  const delUser = useSetAtom(delData);
  const checkUser = useSetAtom(checkData);
  const postUser = useSetAtom(postData);
  const putUser = useSetAtom(putData);

  useEffect(() => {
    getUser();
  }, [getData]);

  function hanClDel(id: number) {
    delUser(id);
  }

  function hanClCheck(id: number) {
    checkUser(id);
  }

  ////add

  const [openAdd, setOpenAdd] = useState(false);

  const formikAdd = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      Images: "",
    },

    validate: (values) => {
      const errors: any = {};
      if (!values.Name.trim()) {
        errors.Name = "Name is required!";
      } else if (!values.Description.trim()) {
        errors.Description = "Description is required!";
      } else if (!values.Images) {
        errors.Images = "Images is required!";
      }

      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      const forms = new FormData();
      forms.append("Name", values.Name);
      forms.append("Description", values.Description);
      forms.append("Images", values.Images);

      postUser(forms);

      setOpenAdd(false);

      resetForm();
    },
  });

  ////edit
  const [openEdit, setOpenEdit] = useState(false);

  interface IobjEdit {
    id?: number | null;
    name: string;
    description: string;
  }
  const [objEdit, setObjEdit] = useState<IobjEdit>({
    id: null,
    name: "",
    description: "",
  });

  const formikEdit = useFormik({
    enableReinitialize: true,
    initialValues: {
      Name: objEdit?.name,
      Description: objEdit?.description,
    },

    validate: (values) => {
      const errors: any = {};
      if (!values.Name.trim()) {
        errors.Name = "Name is required!";
      } else if (!values.Description.trim()) {
        errors.Description = "Description is required!";
      }

      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      putUser({ ...values, id: objEdit?.id });

      setOpenEdit(false);

      resetForm();
    },
  });

  function hanClOpenAdd() {
    setOpenAdd(true);
  }

  function hanClOpenEdit(elem: IObjTodo) {
    setObjEdit({
      id: elem.id,
      name: elem.name,
      description: elem.description,
    });
    setOpenEdit(true);
  }
  function hanCloseEdit() {
    setObjEdit({
      id: null,
      name: "",
      description: "",
    });
    setOpenEdit(false);
  }

  return (
    <div>
      <div className="header p-[10px_20px] flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search name"
            className="p-[5px_10px] placeholder:text-[15px] font-medium rounded-[8px] border"
          />
          <Select>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={hanClOpenAdd}>Add</Button>
      </div>
      <div className="px-[20px]">
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
            {users?.map((e) => {
              return (
                <TableRow key={e.id}>
                  <TableCell className="max-w-[120px] truncate font-medium">
                    {e.name}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {e.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-[#fff] font-medium rounded-[8px] p-[5px_8px] ${e.isCompleted ? "bg-[blue]" : "bg-[red]"}`}
                    >
                      {e.isCompleted ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <img
                      className="w-[150px]"
                      src={`${Api}/images/${e.images?.[0].imageName}`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => hanClCheck(e.id)}>
                          <CheckCheckIcon className="stroke-[green]" />
                          Checked
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => hanClOpenEdit(e)}>
                          <Edit className="stroke-[blue]" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => hanClDel(e.id)}
                          variant="destructive"
                        >
                          <Delete className="stroke-red-500" />
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
      </div>

      {/* add modal */}
      <Dialog open={openAdd} onOpenChange={(e) => setOpenAdd(e)}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={formikAdd.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <div>
                {formikAdd.errors.Name && formikAdd.touched && (
                  <p className="pl-1 text-red-500">{formikAdd.errors.Name}</p>
                )}
                <input
                  className="w-full border p-[5px_10px] rounded-[8px]"
                  value={formikAdd.values.Name}
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                  type="text"
                  name="Name"
                  placeholder="Name"
                />
              </div>
              <div>
                {" "}
                {formikAdd.errors.Description && formikAdd.touched && (
                  <p className="text-red-500">{formikAdd.errors.Description}</p>
                )}
                <input
                  className="w-full border p-[5px_10px] rounded-[8px]"
                  value={formikAdd.values.Description}
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                  type="text"
                  name="Description"
                />
              </div>
              <div>
                {" "}
                {formikAdd.errors.Images && formikAdd.touched && (
                  <p className="text-red-500">{formikAdd.errors.Images}</p>
                )}
                <input
                  className="w-full border p-[5px_10px] rounded-[8px]"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];

                    formikAdd.setFieldValue("Images", file);
                  }}
                  onBlur={formikAdd.handleBlur}
                  type="file"
                  name="Images"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* edit modal */}
      <Dialog open={openEdit} onOpenChange={(e) => setOpenEdit(e)}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={formikEdit.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <div>
                {formikEdit.errors.Name && formikEdit.touched && (
                  <p className="pl-1 text-red-500">{formikEdit.errors.Name}</p>
                )}
                <input
                  className="w-full border p-[5px_10px] rounded-[8px]"
                  value={formikEdit.values.Name}
                  onChange={formikEdit.handleChange}
                  onBlur={formikEdit.handleBlur}
                  type="text"
                  name="Name"
                  placeholder="Name"
                />
              </div>
              <div>
                {formikEdit.errors.Description && formikEdit.touched && (
                  <p className="text-red-500">
                    {formikEdit.errors.Description}
                  </p>
                )}
                <input
                  className="w-full border p-[5px_10px] rounded-[8px]"
                  value={formikEdit.values.Description}
                  onChange={formikEdit.handleChange}
                  onBlur={formikEdit.handleBlur}
                  type="text"
                  name="Description"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Edit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loader ? (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-4">
            <Spinner />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default App;
