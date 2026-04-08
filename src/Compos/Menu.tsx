import React from "react";

import {
  BadgeCheck,
  CreditCardIcon,
  Delete,
  LogOutIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  UserIcon,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/Store/useUser";
import { useNavigate } from "react-router";

interface imgObj {
  id: number;
  imageName: string;
}
interface genObj {
  id: number;
  name: string;
  description: string;
  status: boolean;
  images: imgObj;
  btnDel: any;
  btnChecked: any;
  btnEdit: any;
}
const Menu = ({
  id,
  name,
  description,
  status,
  images,
  btnDel,
  btnChecked,
  btnEdit,
}: genObj) => {
  const usersData = useUser((state) => state);

  const obj = { id: id, name: name, description: description };

  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate(`info/${id}`)}>
          <UserIcon />
          Info
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => btnChecked(id)}
          className="text-[green]"
        >
          <BadgeCheck />
          checked
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => btnEdit(obj)} className="text-[blue]">
          <UserPen />
          edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => btnDel(id)} variant="destructive">
          <Delete />
          delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(Menu);
