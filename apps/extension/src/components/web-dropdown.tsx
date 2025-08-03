import { ExternalLink, Menu, LogIn, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./auth/login-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/context/auth-context";

interface Website {
  name: string;
  url: string;
  description: string;
}

export function WebDropdown() {
  const { isAuthenticated, setToken } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const websites: Website[] = [
    {
      name: "Marketplace",
      url: "https://promptcrafter.studio/marketplace",
      description: "Explore newly crafted prompts",
    },
    {
      name: "Templates",
      url: "https://promptcrafter.studio/templates",
      description: "Your own and starred templates",
    },
    {
      name: "Homepage",
      url: "https://promptcrafter.studio",
      description: "Start with our homepage",
    },
  ];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {websites.map((website) => (
            <DropdownMenuItem key={website.name} asChild>
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-center justify-between"
              >
                <div>
                  <div className="font-medium">{website.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {website.description}
                  </div>
                </div>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          {isAuthenticated ? (
            <DropdownMenuItem asChild>
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setToken(null)}
              >
                <div>
                  <div className="font-medium">Logout</div>
                  <div className="text-xs text-muted-foreground">
                    Logout from your account
                  </div>
                </div>
                <LogOut className="ml-2 h-4 w-4" />
              </div>
            </DropdownMenuItem>
          ) : (
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <div className="flex cursor-pointer items-center justify-between w-full">
                  <div>
                    <div className="font-medium">Login</div>
                    <div className="text-xs text-muted-foreground">
                      Login to your account
                    </div>
                  </div>
                  <LogIn className="ml-2 h-4 w-4" />
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent aria-describedby="login-dialog">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription id="login-dialog">
              Login to your account
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <LoginForm onSuccess={() => setDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
