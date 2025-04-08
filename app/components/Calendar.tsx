'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calendar as BigCalendar, Views } from 'react-big-calendar'
import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Date-fns localizer setup
const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: (date: Date) => {
    return date
  },
  getDay: (date: Date) => date.getDay(),
  locales,
})

// Event type definition
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  desc?: string
  color?: string
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval?: number
    endDate?: Date
  }
}

// Color palette for events
const EVENT_COLORS = [
  '#4285F4', // Blue (Google Calendar primary)
  '#EA4335', // Red
  '#FBBC05', // Yellow
  '#34A853', // Green
  '#8E24AA', // Purple
  '#039BE5', // Light Blue
  '#F6BF26', // Gold
  '#0B8043', // Dark Green
]

const CommunityCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [view, setView] = useState('month')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    start: new Date(),
    end: new Date(),
    color: EVENT_COLORS[0],
    recurring: undefined,
  })

  // For demo purposes, create some example events
  useEffect(() => {
    const demoEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Weekly Community Meeting',
        start: new Date(new Date().setHours(10, 0, 0, 0)),
        end: new Date(new Date().setHours(11, 30, 0, 0)),
        color: EVENT_COLORS[0],
        recurring: {
          frequency: 'weekly',
        },
      },
      {
        id: '2',
        title: 'Coding Workshop',
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        allDay: true,
        color: EVENT_COLORS[1],
      },
      {
        id: '3',
        title: 'Monthly Hackathon',
        start: new Date(new Date().setDate(15)),
        end: new Date(new Date().setDate(16)),
        color: EVENT_COLORS[2],
        recurring: {
          frequency: 'monthly',
        },
      },
    ]
    setEvents(demoEvents)
  }, [])

  // Handle slot selection (creating a new event)
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setNewEvent({
        title: '',
        start,
        end,
        color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
      })
      setIsModalOpen(true)
    },
    []
  )

  // Handle event selection (editing an existing event)
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    const eventToEdit = { ...event }
    setNewEvent(eventToEdit)
    setIsModalOpen(true)
  }, [])

  // Save a new or updated event
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return

    const eventToSave = {
      ...newEvent,
      id: newEvent.id || Math.random().toString(36).substring(2, 9),
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      color: newEvent.color || EVENT_COLORS[0],
    } as CalendarEvent

    if (newEvent.id) {
      // Update existing event
      setEvents(prev => prev.map(e => (e.id === newEvent.id ? eventToSave : e)))
    } else {
      // Add new event
      setEvents(prev => [...prev, eventToSave])
    }

    setIsModalOpen(false)
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      color: EVENT_COLORS[0],
    })
  }

  // Delete an event
  const handleDeleteEvent = () => {
    if (newEvent.id) {
      setEvents(prev => prev.filter(e => e.id !== newEvent.id))
      setIsModalOpen(false)
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        color: EVENT_COLORS[0],
      })
    }
  }

  // Custom event styling
  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header and Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'month' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'week' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'day' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView('agenda')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              view === 'agenda' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Agenda
          </button>
        </div>
        <button
          onClick={() => {
            setNewEvent({
              title: '',
              start: new Date(),
              end: new Date(new Date().setHours(new Date().getHours() + 1)),
              color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
        >
          Add Event
        </button>
      </div>

      {/* Main Calendar Component */}
      <div className="flex-grow border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          defaultView={Views.MONTH}
          view={view as any}
          onView={(newView) => setView(newView)}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: 700 }}
          popup
          components={{
            timeSlotWrapper: props => (
              <div className="bg-white hover:bg-gray-50" {...props} />
            ),
          }}
        />
      </div>

      {/* Event Creation/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {newEvent.id ? 'Edit Event' : 'Add Event'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.start ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => setNewEvent({ 
                      ...newEvent, 
                      start: e.target.value ? new Date(e.target.value) : new Date() 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.end ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => setNewEvent({ 
                      ...newEvent, 
                      end: e.target.value ? new Date(e.target.value) : new Date() 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-6 h-6 rounded-full hover:opacity-80 ${
                        newEvent.color === color ? 'ring-2 ring-offset-2 ring-black' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!newEvent.recurring}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewEvent({
                          ...newEvent,
                          recurring: { frequency: 'weekly' }
                        })
                      } else {
                        setNewEvent({
                          ...newEvent,
                          recurring: undefined
                        })
                      }
                    }}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recurring Event</span>
                </label>
                
                {newEvent.recurring && (
                  <div className="mt-2">
                    <select
                      value={newEvent.recurring.frequency}
                      onChange={(e) => setNewEvent({
                        ...newEvent,
                        recurring: {
                          ...newEvent.recurring,
                          frequency: e.target.value as any
                        }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <div>
                {newEvent.id && (
                  <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityCalendar 