import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Api,
  checkData,
  delById,
  delData,
  getById,
  getData,
  postData,
  postImg,
  putData,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import * as Yup from "yup";
import { useFormik } from "formik";
import Menu from "./Compos/Menu";
import { Delete } from "lucide-react";

const App = () => {
  const { data, objInfo } = useSelector((e: RootState) => e.users);

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

  //////add
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

  //////edit
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

  function hanOpenEdit(elem: IobjEdit) {
    setObjEdit(elem);
    setOpenEdit(true);
  }

  const formikEdit = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: objEdit?.name,
      description: objEdit?.description,
    },
    onSubmit: (values) => {
      console.log({ ...values, id: objEdit?.id });

      disP(putData({ ...values, id: objEdit?.id }));

      setOpenEdit(false);
    },
  });

  /////info

  const [openInfo, setOpenInfo] = useState(false);

  function hanOpenInfo(id: number) {
    disP(getById(id));
    setOpenInfo(true);
  }

  function hanCloseInfo() {
    setOpenInfo(false);
  }

  function hanSubAddImg(e: any) {
    e.preventDefault();

    const formData = new FormData();
    console.log(e.target["Images"].files[0]);

    formData.append("Images", e.target["Images"].files[0]);
    // console.log(Object.fromEntries(formData));

    disP(postImg({ id: objInfo?.id, obj: formData }));
  }
  ////info

  const [idxInfo, setIdxInfo] = useState(null);
  function hanBtnDelId(idx: number, imgId: number) {
    disP(delById(imgId));

    disP(getById(idx));
  }

  return (
    <div>
      <div className="header p-[10px_20px] items-center flex justify-between">
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
                  <TableCell className="font-medium max-w-[100px] truncate">
                    {e.name}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {e.description}
                  </TableCell>
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
                    <Menu
                      id={e.id}
                      name={e.name}
                      description={e.description}
                      btnDel={hanClDel}
                      btnEdit={hanOpenEdit}
                      btnCheck={hanClChecked}
                      btnInfo={hanOpenInfo}
                    />
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
              <DialogTitle>Add profile</DialogTitle>
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
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit modal */}
      <Dialog open={openEdit} onOpenChange={(e) => setOpenEdit(e)}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={formikEdit.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                {formikEdit.touched.name && formikEdit.errors.name && (
                  <p className="text-red-500 text-[12px]">
                    {formikEdit.errors.name}
                  </p>
                )}
                <input
                  value={formikEdit.values.name}
                  onBlur={formikEdit.handleBlur}
                  onChange={formikEdit.handleChange}
                  className={`border border-[#ccc] placeholder:font-[700] p-[5px_10px] w-full rounded-[5px] ${formikEdit.touched.Name && formikEdit.errors.Name ? "border-[red]" : null}`}
                  type="text"
                  name="name"
                  placeholder="Name"
                />
              </div>
              <div>
                {formikEdit.touched.description &&
                  formikEdit.errors.description && (
                    <p className="text-red-500 text-[12px]">
                      {formikEdit.errors.description}
                    </p>
                  )}
                <input
                  onBlur={formikEdit.handleBlur}
                  value={formikEdit.values.description}
                  onChange={formikEdit.handleChange}
                  className={`border border-[#ccc] placeholder:font-[700] p-[5px_10px] w-full rounded-[5px] ${formikEdit.touched.Description && formikEdit.errors.Description ? "border-[red]" : null}`}
                  type="text"
                  name="description"
                  placeholder="Description"
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
      {/* info modal */}
      <Dialog open={openInfo} onOpenChange={(e) => setOpenInfo(e)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Info</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center ">
            <div>
              <Carousel className="w-[500px] max-w-[100px] sm:max-w-xs">
                <CarouselContent className="px-[40px]">
                  {objInfo?.images?.map((e) => {
                    return (
                      <CarouselItem key={e.id}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center  p-6">
                              <img
                                className="w-[400px]"
                                src={`${Api}/images/${e.imageName}`}
                                alt=""
                              />
                            </CardContent>
                            <div className="flex justify-center p-[10px_20px]">
                              <Button
                                onClick={() => hanBtnDelId(objInfo?.id, e.id)}
                                variant={"destructive"}
                              >
                                <Delete />
                              </Button>
                            </div>
                          </Card>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            <form onSubmit={hanSubAddImg} className="flex gap-3 items-center ">
              <input
                name="Images"
                type="file"
                className="border p-[5px_10px]"
                required
              />
              <Button type="submit">Add</Button>
            </form>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium max-w-[100px] truncate">
                    {objInfo?.name}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {objInfo?.description}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${objInfo?.isCompleted ? "bg-blue-500" : "bg-red-500"} text-[#fff] p-[5px_8px] rounded-[8px] font-[600]`}
                    >
                      {objInfo?.isCompleted ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
