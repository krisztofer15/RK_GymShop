import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 flex flex-col">
        {children}
      </div>
    </div>
  );
}
