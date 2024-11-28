import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoadingCard() {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>載入中...</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>請稍候...</p>
                </div>
            </CardContent>
        </Card>
    );
}
