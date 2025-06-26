import React from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import PersonalInfo from "@/pages/Settings/PersonalInfo.jsx";
import LoginSecurity from "@/pages/Settings/LoginSecurity.jsx";
import { PageHeader } from "@/components/ui/page-header"
import Languages from "@/pages/Settings/Languages.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sidebarItems = [
  { id: "personal", label: "Perfil", icon: <User /> },
  { id: "security", label: "Login & Security", icon: <Lock /> },
  { id: "notifications", label: "Notifications", icon: <Bell /> },
  { id: "languages", label: "Languages", icon: <Globe /> },
];

const Settings = () => {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen mt-4 pt-[--header-height]">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Configuraciones"
          />
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {sidebarItems.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Visualiza y edita tu perfil.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfo />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Login & Security</CardTitle>
              <CardDescription>
                Manage your login credentials and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginSecurity />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                This is the <strong>notifications</strong> settings section.
                Content goes here.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>
                Choose your preferred language for the interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Languages />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
