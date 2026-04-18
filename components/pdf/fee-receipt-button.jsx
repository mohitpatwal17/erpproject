"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FeeReceiptPDF } from "./fee-receipt";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";

/**
 * FeeReceiptButton handles the heavy lifting of PDF generation
 * in an isolated component to avoid SSR and Turbopack issues.
 */
export default function FeeReceiptButton({ student, transaction }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!student || !transaction || !isMounted) return null;

    return (
        <div className="inline-flex">
            <PDFDownloadLink
                document={<FeeReceiptPDF student={student} transaction={transaction} />}
                fileName={`receipt-${student.rollNumber}.pdf`}
            >
                {({ loading }) => (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={loading} 
                        className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <FileDown className="h-4 w-4 mr-1" />
                                Receipt
                            </>
                        )}
                    </Button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
