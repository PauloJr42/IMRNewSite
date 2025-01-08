import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from 'lucide-react';

interface OnlineUser {
  id: string;
  email: string;
  last_seen: string;
}

export function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).flat() as OnlineUser[];
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Online Users</h3>
      <div className="space-y-2">
        {onlineUsers.map((user, index) => (
          <div
            key={`${user.id}-${index}`}
            className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm"
          >
            <div className="relative">
              <User className="h-8 w-8 text-gray-400" />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">
                Active since {new Date(user.last_seen).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}