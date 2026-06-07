import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import Image from 'next/image';

const UserButton = async () => {
  const session = await auth();
  // console.log(session);

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  // get first character from users name
  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';
  // Optional chaining(?), user? -> it means if user doesn't exist then it's going to be undefined rather than throw an error
  // Nullish coalescing operator(??) returns the right-hand side only if the left-hand side is null or undefined

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 p-0 rounded-full overflow-hidden ml-2 flex items-center justify-center bg-gray-200 dark:bg-gray-800 cursor-pointer"
            >
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="google image"
                  width={40}
                  height={40}
                />
              ) : (
                firstInitial || <UserIcon />
              )}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-foreground font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
