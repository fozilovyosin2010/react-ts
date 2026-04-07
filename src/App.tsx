import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./components/ui/button";

import { BadgeCheck, DeleteIcon, Edit, MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import axios from "axios";

import * as Yup from "yup";

// schema for forms
const userSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),

  description: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description must be at most 200 characters")
    .required("Description is required"),
});

interface UserObj {
  id: string;
  name: string;
  status: boolean;
  description: string;
}

const api = "http://localhost:3000/users";

const App = () => {
  const [users, setUsers] = useState<UserObj[]>([]);

  const [statusF, setStatusF] = useState("all");
  const [inpS, setinpS] = useState("");

  const getData = async () => {
    try {
      const { data } = await axios.get(api);

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const delData = async (id: string) => {
    try {
      await axios.delete(`${api}/${id}`);
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const postData = async (obj: UserObj) => {
    try {
      await axios.post(api, obj);
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const sData = async (req: string, s: string) => {
    try {
      const { data } = await axios.get(`${api}?${req}=${s.trim()}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const patchData = async (
    id: string,
    obj: { name: string; description: string },
  ) => {
    try {
      await axios.patch(`${api}/${id}`, obj);
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const checkData = async (id: string, obj: { status: boolean }) => {
    try {
      await axios.patch(`${api}/${id}`, obj);
      getData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // changing status in header
  function handleChangeStatus(e: string) {
    setStatusF(e);

    sData("status", e);
  }

  function handleChangeInp(e) {
    setinpS(e.target.value);

    sData("name_like", e.target.value.trim().toLowerCase());
  }

  // delModal

  const [openDel, setOpenDel] = useState(false);
  const [idxDel, setIdxDel] = useState<string | null>(null);

  function handleOpenDel(id: string) {
    setOpenDel(true);

    setIdxDel(id);
  }

  function handleCloseDel() {
    setOpenDel(false);

    setIdxDel(null);
  }

  function handleBtnDel(e: string) {
    delData(e);

    handleCloseDel();
  }

  // add

  // form add

  const formikAdd = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: (val) => {
      const obj = {
        id: new Date().getTime().toString(),
        status: false,
        ...val,
      };

      postData(obj);
      // handleCloseAdd();
    },
    validationSchema: userSchema,
  });

  // add modal

  const [openAdd, setOpenAdd] = useState(false);

  function handleOpenAdd() {
    setOpenAdd(true);
  }

  function handleCloseAdd() {
    setOpenAdd(false);

    formikAdd.resetForm();
  }

  //checked

  function handleCheckBtn(elem: UserObj) {
    const obj = { status: !elem.status };

    checkData(elem.id, obj);
  }

  // edit

  // edit modal

  const [openEdit, setOpenEdit] = useState(false);

  const [editObj, setEditObj] = useState<UserObj | null>(null);

  function handleCloseEdit() {
    setOpenEdit(false);
  }

  function handleOpenEdit(elem: UserObj) {
    setOpenEdit(true);

    setEditObj(elem);
  }

  // edit form

  const formikEdit = useFormik({
    // allows to update
    enableReinitialize: true,
    initialValues: {
      name: editObj?.name || "",
      description: editObj?.description || "",
    },
    onSubmit: (values) => {
      patchData(editObj?.id as string, values);
    },
  });

  return (
    <div>
      <div className="header flex items-center justify-between p-[10px_20px] border-b">
        <div className="flex gap-3 items-center">
          <input
            onChange={handleChangeInp}
            placeholder="Name..."
            type="text"
            className="border rounded-lg  p-[5px_10px]"
          />
          <Select onValueChange={handleChangeStatus}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"all"}>All</SelectItem>
                <SelectItem value={"true"}>Active</SelectItem>
                <SelectItem value={"false"}>Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleOpenAdd}>Add</Button>
      </div>
      <main className="p-[20px_40px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((e) => {
              return (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    {e.description}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate">
                    <span
                      className={`${e.status ? "bg-[#06abe7]" : "bg-[#e90707]"} text-[#fff] p-[5px_10px] rounded-lg`}
                    >
                      {e.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  {/* options */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(e)}>
                          <Edit />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleOpenDel(e.id)}
                          variant="destructive"
                        >
                          <DeleteIcon />
                          <span>delete</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleCheckBtn(e)}
                          variant="destructive"
                        >
                          <BadgeCheck />
                          <span>checked</span>
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
      {/* del modal */}
      <Dialog open={openDel} onOpenChange={setOpenDel}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Do you really want delete user {idxDel}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleCloseDel} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={() => handleBtnDel(idxDel!)}>DELETE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* add modal */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-sm">
          <form action="" onSubmit={formikAdd.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <input
                value={formikAdd.values.name}
                onChange={formikAdd.handleChange}
                required
                name="name"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Name"
              />
              <input
                value={formikAdd.values.description}
                onChange={formikAdd.handleChange}
                required
                name="description"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Description"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCloseAdd} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">ADD</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* here */}
      {/* edit modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-sm">
          <form action="" onSubmit={formikEdit.handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <input
                value={formikEdit.values.name}
                onChange={formikEdit.handleChange}
                required
                name="name"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Name"
              />
              <input
                value={formikEdit.values.description}
                onChange={formikEdit.handleChange}
                required
                name="description"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Description"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCloseEdit} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">EDIT</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
