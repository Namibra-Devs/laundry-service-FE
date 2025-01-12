import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import ViewToggle from "../OrdersViewToggle";
import { useState } from "react";

const Filters = () => {
  const branches = ["Branch 1", "Branch 2"];
  const [selectedBranch, setSelectedBranch] = useState("Branch 1");
  const [searchInput, setSearchInput] = useState("");
  return (
    <div className="w-full flex items-center py-4 justify-between">
      <div className="sm:block hidden">
        <ViewToggle />
      </div>
      <div className="flex items-center space-x-5">
        <Input
          placeholder="Search customers..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-48"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {selectedBranch} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {branches?.map((branch) => (
              <DropdownMenuItem
                key={branch}
                onClick={() => {
                  setSelectedBranch(branch);
                }}
              >
                {branch}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => {
                setSelectedBranch("Branch 1");
              }}
            >
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
export default Filters;
