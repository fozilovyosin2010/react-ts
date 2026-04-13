import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CheckCheckIcon, Edit, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Iprops {
  id: number;
  name: string;
  description: string;
  btnDel(id: number): void;
  btnCheck(id: number): void;
  btnEdit(obj: { id: number; name: string; description: string }): void;
}

const Menu = React.memo(
  ({ id, name, description, btnDel, btnCheck, btnEdit }: Iprops) => {
    const objEdit = { id: id, name: name, description: description };
    return (
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Ellipsis />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => btnEdit(objEdit)}
              className="stroke-[blue] text-[blue]"
            >
              <Edit />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => btnCheck(id)}
              className="stroke-[green] text-[green]"
            >
              <CheckCheckIcon />
              <span>Checked</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => btnDel(id)} variant="destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);

export default Menu;
