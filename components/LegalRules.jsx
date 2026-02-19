"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function LegalRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRules() {
      try {
        const response = await fetch("/api/legal-rules");
        if (response.ok) {
          const data = await response.json();
          setRules(data);
        }
      } catch (error) {
        console.error("Failed to fetch legal rules:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRules();
  }, []);

  const filteredRules = rules.filter((rule) =>
    rule.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.offense.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Legal Rules Database</h1>
        <p className="text-muted-foreground">
          Reference guide for IPC sections, offenses, and bail classifications.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by section, offense, or keywords..."
          className="pl-8 max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50" />
              <CardContent className="h-32 bg-muted/30 mt-4" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRules.map((rule) => (
            <Card key={rule._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    Section {rule.section}
                  </CardTitle>
                  <Badge variant={rule.category === "Bailable" ? "success" : "destructive"}>
                    {rule.category}
                  </Badge>
                </div>
                <CardDescription className="font-medium text-primary">
                  {rule.type} - {rule.offense}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                 Cause : {rule.description}
                </p>
                <p className="text-sm text-muted-foreground">
                 Punishemt : {rule.punishment}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between border-t text-sm">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline" className={
                    rule.riskLevel === "High" ? "border-red-500 text-red-500" :
                    rule.riskLevel === "Medium" ? "border-yellow-500 text-yellow-500" :
                    "border-green-500 text-green-500"
                  }>
                    {rule.riskLevel}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!loading && filteredRules.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No rules found matching your search.
        </div>
      )}
    </div>
  );
}
