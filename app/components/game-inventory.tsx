"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  usable: boolean;
}

interface GameInventoryProps {
  items: InventoryItem[];
  onUseItem?: (itemId: string) => void;
}

export function GameInventory({ items, onUseItem }: GameInventoryProps) {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <span className="text-xl">🎒</span>
            <h3 className="text-sm font-medium text-muted-foreground">
              Inventory
            </h3>
            <span className="ml-auto text-xs text-muted-foreground">
              {items.length}/10
            </span>
          </div>

          {/* Items */}
          <ScrollArea className="h-[200px]">
            {items.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-8">
                No items collected yet
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-md border border-border ${
                      item.usable
                        ? "hover:bg-primary/10 cursor-pointer"
                        : "opacity-60"
                    }`}
                    onClick={() => item.usable && onUseItem?.(item.id)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </div>
                    </div>
                    {item.usable && (
                      <div className="text-xs text-primary">Use</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
