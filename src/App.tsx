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

import { DeleteIcon, Edit, MoreHorizontalIcon } from "lucide-react";

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

const App = () => {
  const api = "http://localhost:3000/users";

  interface UserObj {
    id: string;
    name: string;
    status: boolean;
    description: string;
  }

  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    getData();
  }, []);

  const [openDel, setOpenDel] = useState(false);

  const [idxDel, setIdxDel] = useState(null);

  const handleDelBtn = (id: string) => {
    setIdxDel(id);

    setOpenDel(true);
  };

  function handleOpenDel() {
    setOpenDel(true);
  }
  function handleCloseDel() {
    setOpenDel(false);

    setIdxDel(null);
  }

  const [openAdd, setOpenAdd] = useState(false);

  function handleOpenAdd() {
    setOpenAdd(true);
  }
  function handleCloseAdd() {
    setOpenAdd(false);
  }

  function handleSubmiutAdd(event) {
    event.preventDefault();

    const obj = {
      id: new Date().getTime().toString(),
      name: event.target["name"].value.trim(),
      description: event.target["des"].value.trim(),
      status: false,
    };

    postData(obj);

    handleCloseAdd();
  }

  return (
    <div>
      <div className="header flex items-center justify-between p-[10px_20px] border-b">
        <div className="flex gap-3 items-center">
          <input
            onChange={(e) => setinpS(e.target.value)}
            placeholder="Name..."
            type="text"
            className="border rounded-lg  p-[5px_10px]"
          />
          <Select
            onValueChange={(e) => {
              console.log(e);
              setStatusF(e);
            }}
          >
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
            {users
              .filter((e) =>
                e.name.toLowerCase().includes(inpS.toLowerCase().trim()),
              )
              .filter((e) => {
                if (statusF === "true") {
                  return e.status;
                } else if (statusF === "false") {
                  return !e.status;
                } else {
                  return e;
                }
              })
              .map((e, i) => {
                return (
                  <TableRow key={i}>
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelBtn(e.id)}
                            variant="destructive"
                          >
                            <DeleteIcon />
                            <span>delete</span>
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
            <Button onClick={() => handleDelBtn(idxDel!)}>DELETE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-sm">
          <form action="" onSubmit={handleSubmiutAdd}>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <input
                required
                name="name"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Name"
              />
              <input
                required
                name="des"
                type="text"
                className="p-[10px_15px] w-full rounded-md border"
                placeholder="Description"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleCloseDel} variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">ADD</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
