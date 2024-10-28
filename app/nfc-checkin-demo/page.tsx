'use client'

import { useState } from 'react'
import { Beer, Gift, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [checkins, setCheckins] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const handleCheckin = () => {
    setCheckins(prev => prev + 1)
    if (checkins + 1 >= 5) {
      setShowReward(true)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cozy Life 2.0 NFC 打卡活動</CardTitle>
          <CardDescription>在不同酒吧打卡，獲得印章和優惠！</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Beer key={i} className={`w-8 h-8 ${i < checkins ? 'text-yellow-500' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-center">已獲得 {checkins} 個印章</p>
            <Button 
              className="w-full" 
              onClick={handleCheckin}
            >
              <QrCode className="mr-2 h-4 w-4" /> 模擬 NFC 打卡
            </Button>
            {showReward && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg text-center">
                <Gift className="inline-block w-6 h-6 text-yellow-500 mb-2" />
                <p className="font-semibold">恭喜！您已獲得抽獎資格！</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            每次打卡可獲得當日酒水9折優惠
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

