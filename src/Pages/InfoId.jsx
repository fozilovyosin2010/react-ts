import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import * as Yup from "yup";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import axios from "axios";
import { useFormik } from "formik";

const api = "http://37.27.29.18:8001";
const InfoId = () => {
  const { id } = useParams();

  const [user, setUser] = useState();

  const getById = async () => {
    try {
      const { data } = await axios.get(`${api}/api/to-dos/${id}`);
      setUser(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const delById = async (imgId) => {
    try {
      await axios.delete(`${api}/api/to-dos/images/${imgId}`);
      getById();
    } catch (error) {
      console.error(error);
    }
  };
  const postById = async (imgObj) => {
    try {
      await axios.post(`${api}/api/to-dos/${id}/images`, imgObj);
      getById();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getById();
  }, []);

  // add modal

  const [openAdd, setOpenAdd] = useState(false);

  function handleOpenAdd() {
    setOpenAdd(true);
  }
  function handleCloseAdd() {
    setOpenAdd(false);
  }

  function handleSubmitAdd(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Images", e.target["Images"].files[0]);

    postById(formData);

    handleCloseAdd();
  }

  return (
    <div className="sec px-[20px]">
      <Carousel className="w-full max-w-[12rem] m-[20px_auto_10px] sm:max-w-xs">
        <CarouselContent>
          {user?.images.map((img) => (
            <CarouselItem key={img.id}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col gap-[30px] justify-between aspect-square items-center ">
                    <img
                      src={`${api}/images/${img.imageName}`}
                      alt=""
                      className="flex w-[300px] max-h-[300px]"
                    />
                    <Button onClick={() => delById(img.id)}>Delete</Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-3">
        <Button onClick={handleOpenAdd}>Add</Button>
      </div>
      <div>
        <Table className="border overflow-x-auto max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{user?.name}</TableCell>
              <TableCell className="font-medium">{user?.description}</TableCell>
              <TableCell className="font-medium">
                <span
                  className={`${user && user.isCompleted ? "bg-blue-500" : "bg-red-500"} text-[#fff] p-[5px_10px] rounded-[5px]`}
                >
                  {user && user?.isCompleted ? "ACTIVE" : "INACTIVE"}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Dialog open={openAdd} onOpenChange={(e) => setOpenAdd(e)}>
        <DialogContent>
          <form onSubmit={handleSubmitAdd}>
            <DialogHeader>
              <DialogTitle>Add Image Modal</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Input type="file" name="Images" />
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
    </div>
  );
};

export default InfoId;
