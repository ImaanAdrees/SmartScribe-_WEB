import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Bell, Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { requireAdmin } from "@/lib/serverAuth";

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Feature Update",
      message: "We launched new dashboard widgets.",
    },
    {
      id: 2,
      title: "Scheduled Maintenance",
      message: "App downtime on Monday 11 PM.",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMsg, setNewMsg] = useState("");

  const addNotification = () => {
    if (!newTitle.trim() || !newMsg.trim()) return;
    setNotifications([
      ...notifications,
      { id: Date.now(), title: newTitle, message: newMsg },
    ]);
    setNewTitle("");
    setNewMsg("");
    setIsModalOpen(false);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notifications.map((item) => (
          <Card key={item.id} className="shadow-md border border-gray-200">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-gray-600 mt-1 text-sm">{item.message}</p>

              <div className="flex justify-end mt-4">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={() => deleteNotification(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md mx-auto shadow-lg">
            <h3 className="font-bold text-xl mb-4">Create Notification</h3>
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-3"
            />
            <Textarea
              placeholder="Message"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addNotification}>Send</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

AdminNotification.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminNotification;

export const getServerSideProps = requireAdmin;
