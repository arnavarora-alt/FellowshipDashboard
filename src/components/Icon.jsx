import {
  ShieldCheck, UserCheck, CalendarClock, Eye, Crown, CalendarPlus, UsersRound, Trophy, Clapperboard, Lightbulb,
  CalendarDays, Palette, ClipboardCheck, Sparkles, Users, Rocket, MapPin, Camera, Handshake, Megaphone, Ticket, Mic,
  DoorOpen, BookOpen, Dumbbell, FolderOpen, ListChecks, HeartPulse, CalendarCheck, Database, Home, Instagram, PartyPopper,
  PencilRuler, Mountain, Building2, KeyRound, CalendarRange, ScrollText, BarChart3, ClipboardList, Network, Route, Flag,
  Swords, Briefcase, AlarmClock, FileText, BadgeCheck, GraduationCap, Video, MessageCircleQuestion, Scale,
  MessageSquarePlus, Award, LifeBuoy, Contact, Activity, Files, UserPlus, Search, LogOut, Bell, X, Check, Plus, Download,
  ChevronDown, ChevronRight, ArrowRight, ArrowUpRight, ExternalLink, Clock, Copy, Lock, Mail, Phone, Upload, Filter, Menu,
  Star, Heart, Gamepad2, Send, TrendingUp, TrendingDown, Gift, Link2, Pencil, Trash2, Play, Info, TriangleAlert,
  CircleCheck, Flame, Medal, RefreshCcw, ArrowUp, ArrowDown, Pin, Zap, Target, Layers, Image, Newspaper, Wallet, Music,
  Hash, ArrowUpDown, Circle, Repeat, Eraser, Smile, Fingerprint, Shuffle, FileSignature, Wrench, Tag, Link, Globe,
} from 'lucide-react';

const MAP = {
  ShieldCheck, UserCheck, CalendarClock, Eye, Crown, CalendarPlus, UsersRound, Trophy, Clapperboard, Lightbulb,
  CalendarDays, Palette, ClipboardCheck, Sparkles, Users, Rocket, MapPin, Camera, Handshake, Megaphone, Ticket, Mic,
  DoorOpen, BookOpen, Dumbbell, FolderOpen, ListChecks, HeartPulse, CalendarCheck, Database, Home, Instagram, PartyPopper,
  PencilRuler, Mountain, Building2, KeyRound, CalendarRange, ScrollText, BarChart3, ClipboardList, Network, Route, Flag,
  Swords, Briefcase, AlarmClock, FileText, BadgeCheck, GraduationCap, Video, MessageCircleQuestion, Scale,
  MessageSquarePlus, Award, LifeBuoy, Contact, Activity, Files, UserPlus, Search, LogOut, Bell, X, Check, Plus, Download,
  ChevronDown, ChevronRight, ArrowRight, ArrowUpRight, ExternalLink, Clock, Copy, Lock, Mail, Phone, Upload, Filter, Menu,
  Star, Heart, Gamepad2, Send, TrendingUp, TrendingDown, Gift, Link2, Pencil, Trash2, Play, Info, TriangleAlert,
  CircleCheck, Flame, Medal, RefreshCcw, ArrowUp, ArrowDown, Pin, Zap, Target, Layers, Image, Newspaper, Wallet, Music,
  Hash, ArrowUpDown, Circle, Repeat, Eraser, Smile, Fingerprint, Shuffle, FileSignature, Wrench, Tag, Link, Globe,
};

export default function Icon({ name, size = 20, strokeWidth = 2, ...rest }) {
  const C = MAP[name] || Circle;
  return <C size={size} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />;
}
