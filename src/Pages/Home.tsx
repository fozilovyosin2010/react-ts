import React, { useCallback, useEffect, useState } from "react";

import * as Yup from "yup";

import { useFormik } from "formik";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Menu from "@/Compos/Menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import { useUser } from "@/Store/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const api = "http://37.27.29.18:8001";

const userSchema = Yup.object({
  Name: Yup.string().required("Enter Name pls"),
  Description: Yup.string().required(),
  Images: Yup.mixed().required(),
});
const userSchemaEdit = Yup.object({
  name: Yup.string().required("Enter Name pls"),
  description: Yup.string().required(),
});

interface editObj {
  id: 0;
  name: "string";
  description: "string";
}

const Home = () => {
  const usersData: any = useUser((state) => state);

  useEffect(() => {
    usersData.getData();
  }, []);

  const handleBtnDel = useCallback(
    (id: number) => {
      usersData.delData(id);
    },
    [usersData],
  );

  const handleBtnCheck = useCallback(
    (id: number) => {
      usersData.checkData(id);
    },
    [usersData],
  );

  // add modal
  const [openAdd, setOpenAdd] = useState(false);

  function handleOpenAdd() {
    setOpenAdd(true);
  }
  function handleCloseAdd() {
    setOpenAdd(false);
  }

  const formikAdd: any = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      Images: null,
    },

    validationSchema: userSchema,

    onSubmit: (values: any, { resetForm }) => {
      console.log(values);

      const formData = new FormData();
      formData.append("Name", values.Name.trim());
      formData.append("Description", values.Description.trim());
      formData.append("Images", values.Images);

      usersData.postData(formData);

      resetForm();
      handleCloseAdd();
    },
  });

  // edit modal

  const [openEdit, setOpenEdit] = useState(false);
  const [objEdit, setObjEdit] = useState<any>();

  function handleOpenEdit(elem) {
    setOpenEdit(true);

    setObjEdit(elem);
  }
  function handleCloseEdit() {
    setOpenEdit(false);
  }

  const formikEdit: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: objEdit?.id,
      name: objEdit?.name || "",
      description: objEdit?.description || "",
    },
    validationSchema: userSchemaEdit,
    onSubmit: (val) => {
      usersData.putData(val);
      handleCloseEdit();
    },
  });

  return (
    <div className="sec">
      <div className="header  border-b">
        <div className="sec p-[10px_20px] flex justify-between">
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
          <Button onClick={handleOpenAdd}>Add</Button>
        </div>
      </div>
      <div className="p-[10px_20px]">
        <Table className="border overflow-x-auto max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Image</TableHead>
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.users.map((e) => {
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="font-medium">{e.description}</TableCell>
                  <TableCell className="font-medium">
                    <span
                      className={`${e.isCompleted ? "bg-blue-500" : "bg-red-500"} text-[#fff] p-[5px_10px] rounded-[5px]`}
                    >
                      {e.isCompleted ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {e?.images.map((img: { id: number; imageName: string }) => {
                      return (
                        <img
                          className="w-[300px] max-h-[300px]"
                          key={img.id}
                          src={`${api}/images/${img?.imageName}`}
                        />
                      );
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Menu
                      id={e.id}
                      name={e.name}
                      description={e.description}
                      status={e.isCompleted}
                      images={e.images}
                      btnDel={handleBtnDel}
                      btnChecked={handleBtnCheck}
                      btnEdit={handleOpenEdit}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* add modal */}
      <Dialog open={openAdd} onOpenChange={(e) => setOpenAdd(e)}>
        <DialogContent>
          <form onSubmit={formikAdd.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Modal</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                onBlur={formikAdd.handleBlur}
                value={formikAdd.values.Name}
                onChange={formikAdd.handleChange}
                type={"text"}
                name="Name"
                placeholder="Name"
              />

              {formikAdd.touched.Name && formikAdd.errors.Name && (
                <span className="text-red-500 text-[12px]">
                  {formikAdd.errors.Name}
                </span>
              )}
              <Input
                value={formikAdd.values.Description}
                onBlur={formikAdd.handleBlur}
                onChange={formikAdd.handleChange}
                type={"text"}
                name="Description"
                placeholder="Description"
              />
              {formikAdd.touched.Description &&
                formikAdd.errors.Description && (
                  <span className="text-red-500 text-[12px]">
                    {formikAdd.errors.Description}
                  </span>
                )}
              <Input
                type="file"
                name="Images"
                onBlur={formikAdd.handleBlur}
                onChange={(e: any) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    formikAdd.setFieldValue("Images", e.currentTarget.files[0]);
                  }
                }}
              />
              {formikAdd.touched.Images && formikAdd.errors.Images && (
                <span className="text-red-500 text-[12px]">
                  {formikAdd.errors.Images}
                </span>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCloseAdd} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* edit modal */}
      <Dialog open={openEdit} onOpenChange={(e) => setOpenEdit(e)}>
        <DialogContent>
          <form onSubmit={formikEdit.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Modal</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                onBlur={formikEdit.handleBlur}
                value={formikEdit.values.name}
                onChange={formikEdit.handleChange}
                type={"text"}
                name="name"
                placeholder="Name"
              />

              {formikEdit.touched.Name && formikEdit.errors.Name && (
                <span className="text-red-500 text-[12px]">
                  {formikEdit.errors.Name}
                </span>
              )}
              <Input
                value={formikEdit.values.description}
                onBlur={formikEdit.handleBlur}
                onChange={formikEdit.handleChange}
                type={"text"}
                name="description"
                placeholder="Description"
              />
              {formikEdit.touched.Description &&
                formikEdit.errors.Description && (
                  <span className="text-red-500 text-[12px]">
                    {formikEdit.errors.Description}
                  </span>
                )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCloseEdit} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Edit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
